<?php

namespace App\Http\Controllers;

use App\Events\MessageEvent;
use App\Events\MessagesEvent;
use App\Http\Requests\MessageUpdateRequest;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Http\{
    Request,
    Response
};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Notification;
use App\Notifications\MessageNotification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="message",
 *     description="Mensagens"
 * )
 */
class MessageController extends Controller
{

    protected $model;
    protected $user;

    public function __construct(Message $model, Request $request)
    {
        $this->model = $model;
        $this->user = $request->user();
    }

    /**
     * @OA\Get(
     *     tags={"message"},
     *     summary="Lista todos mensagens",
     *     description="Lista todos mensagens",
     *     path="/api/message",
     *     @OA\Response(response="200", description="Lista todos mensagens cadastrados"),
     * ),
     *
     */
    public function index(Request $request)
    {
        $messages = Message::with(['user', 'messageDefault'])->limit(50);
        if (isset($request->order)) {
            $messages->orderBy('messages.created_at', $request->order);
        } else {
            $messages->orderBy('messages.created_at', "DESC");
        }

        if (isset($request->children) && $request->children == "false") {
            $messages->whereNull('message_id');
        }
        if (isset($request->user_id)) {
            $messages->where('user_id', $request->user_id);
        } else {
            $messages->where('user_id', '!=', $this->user->id);
        }

        if (isset($request->termo)) {
            $messages->select('messages.*')->join('users', 'users.id', '=', 'messages.user_id')->where(function ($query) use ($request) {
                $query->orWhere('messages.id', $request->termo)->orWhere('users.name', 'like', "%{$request->termo}%");
            });
        }

        $messages = $messages->whereHas('order', function ($q) {
            $q->where('status', '=', 'approved');
        })->get();

        return response()->json($messages);
    }

    /**
     * @OA\Post(
     *   tags={"message"},
     *   path="/api/message",
     *   summary="Cadastra uma nova mensagem",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          type="object",
     *          @OA\Property(
     *            property="user_id",
     *            type="integer",
     *          ),
     *          @OA\Property(
     *            property="message",
     *            type="text",
     *          ),
     *          @OA\Property(
     *            property="read",
     *            type="boolean",
     *            description="0 - não lida, 1 - lida"
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $msg = 'Mensagem enviada com sucesso!';
            $params = $request->all();
            $user_id = $this->user->id;

            if (isset($params['status_default']) && $params['status_default'] == 10) {
                $message = $this->model->find($params['message_id']);
                $dados = ['status' => 10, 'pergunta' => $params['pergunta'], 'resposta' => $params['resposta']];
                $message->fill($dados)->save();

                try {
                    Http::withToken(env('MAIL_PASSWORD'))->post('https://api.sendgrid.com/v3/mail/send', [
                        'from' => [
                            'email' => 'naoresponda@advogadossc.com'
                        ],
                        'personalizations' => [
                            [
                                'to' => [
                                    [
                                        'email' => $this->user->email,
                                        'name' => $this->user->name
                                    ]
                                ],
                                'dynamic_template_data' => [
                                    'type' => 'consultation',
                                    'client_name' => $this->user->name,
                                    'pergunta' => $params['pergunta'],
                                    'resposta' => $params['resposta']
                                ]
                            ]
                        ],
                        'template_id' => 'd-e90ee1fd8200449bba6cb7c3aefceb45'
                    ]);
                } catch (\Exception $e) {
                    Log::debug('Message Sendgrid', $e->getMessage());
                }
            } else {
                if (isset($params['message']) && strlen($params['message']) > 5) {
                    $order = Order::find($params['order_id']);
                    if ($order && in_array($order->status, ['approved', 'in_process'])) {
                        $params['user_id'] = $user_id;
                        $params['read'] = 0;
                        $store = $this->model->create($params);

                        Notification::route('mail', [
                            env("MAIL_TO_ADDRESS") => env("MAIL_TO_NAME")
                        ])->notify(
                            new MessageNotification($this->user->name, $params['message'])
                        );
                        $msg = 'Sua consulta foi enviada para nossos Advogados especializados e será respondida em até 48 horas!\n';
                        $msg .= 'Realize Login em nosso site para acessar sua Consulta no seu perfil em “Suas Consultas”.';

                        try {
                            Http::withToken(env('MAIL_PASSWORD'))->post('https://api.sendgrid.com/v3/mail/send', [
                                'from' => [
                                    'email' => 'naoresponda@advogadossc.com'
                                ],
                                'personalizations' => [
                                    [
                                        'to' => [
                                            [
                                                'email' => $this->user->email,
                                                'name' => $this->user->name
                                            ]
                                        ],
                                        'dynamic_template_data' => [
                                            'type' => 'consultation',
                                            'client_name' => $this->user->name,
                                            'message' => $params['message'],
                                            'total' => $order->amount
                                        ]
                                    ]
                                ],
                                'template_id' => 'd-750ce584d1494634b01c112f878e5e30'
                            ]);
                        } catch (\Exception $e) {
                            Log::debug('Message Sendgrid', $e->getMessage());
                        }
                    } else {
                        return response()->json([
                            'error'   => true,
                            'message' => 'É necessário realizar a compra antes!',
                        ], Response::HTTP_OK);
                    }
                }
            }

            event(new MessageEvent(['message_id' => $params['message_id'] ?? $store->id]));
            event(new MessagesEvent(['user_id' => $user_id]));

            DB::commit();
            return response()->json(['error' => false, 'message' => $msg, "data" => $store ?? []], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => true, 'message' => "Falha ao enviar mensagem: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @OA\Get(
     *   tags={"message"},
     *   path="/api/message/{id}",
     *   summary="Exibe uma mensagem",
     *   @OA\Response(response=200,description="OK"),
     * )
     */
    public function show($id)
    {
        $field = $this->model->with(['user', 'messageDefault', 'messages'])->find($id);
        $message = $this->model->find($id);
        $user_id = $this->user->id;
        if ($message->user_id != $user_id) {
            $message->fill(['read' => 1])->save();
        }

        $messages = $this->model->where('message_id', $message->id)->get();
        foreach ($messages as $message) {
            if ($message->user_id != $user_id) {
                $message->fill(['read' => 1])->save();
            }
        }

        event(new MessagesEvent(['user_id' => $user_id, 'force' => true]));

        return response()->json($field);
    }

    /**
     * @OA\Put(
     *   tags={"message"},
     *   path="/api/message",
     *   summary="Edita uma mesangem",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *          @OA\Property(
     *            property="read",
     *            type="boolean",
     *            description="0 - não lida, 1 - lida"
     *          ),
     *     ),
     *   ),
     *   @OA\Response(response=201,description="OK",),
     *   @OA\Response(response=403, description="Unauthorized"),
     *   @OA\Response(response=400, description="Bad Request")
     * )
     */
    public function update(MessageUpdateRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $params = $request->all();
            $message = $this->model->find($id);

            $message->fill($params)->save();

            DB::commit();
            return response()->json(['message' => "Menagem atualizada com sucesso", "data" => $message], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao atualizar mensagem: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @OA\Delete(
     *   tags={"message"},
     *   path="/api/message/{id}",
     *   summary="Remove uma mensagem",
     *   @OA\Response(response=200,description="OK"),
     *   @OA\Response(response=404, description="Not Found")
     * )
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $res = $this->model->find($id);
            $res->delete();

            DB::commit();
            return response()->json(['message' => "Bloco excluído com sucesso", "result" => $res], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => "Falha ao excluir Bloco: {$e->getMessage()}"], 500);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function toPdf(Request $request, $id)
    {
        $message = $this->model->find($id);

        $pdf = App::make('snappy.pdf.wrapper');
        $pdf->loadHTML(
            $this->_getContent($message, true)
        );
        $pdf->setOption('margin-top', '45mm');
        $pdf->setOption('margin-bottom', '20mm');
        $pdf->setOption('header-html', view('header_template_paper', ['imgWidth' => '150px'])->render());
        $pdf->setOption('footer-html', view('footer_template_paper')->render());
        return $pdf->inline();
    }

    private function _getContent($message, $decode = false)
    {
        $content = '<style>
            @import url(\'https://fonts.googleapis.com/css2?family=Montserrat&display=swap\');
            .watermark {
                background: url(\'' . url('api/public/marca-dagua.png') . '\') 0 0 !important;
                background-position: center;
                background-repeat: repeat-y;
                background-size: 100%;
                background-attachment: fixed;
                font-family: \'Montserrat\', sans-serif;
                font-size: 20px;
            }
            .flexrow {
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
            }
            .flexrow>div {
                flex: 1;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                text-align: center;
                font-weight: bold;
                font-size: 22px;
            }
        </style>';
        $content .= '<body class="watermark">';
        $content .= '<br /><div class="flexrow">';
        $content .= '<div>Nome Requerente: ' . $message->user->name . '</div>';
        $content .= '<div>Data: ' . $message->created_at->format('d/m/Y') . '</div>';
        $content .= '<div>Número de Refer&ecirc;ncia: ' . $message->id . '</div>';
        $content .= '</div>';
        $content .= '<br /><br /><div style="color:#5cd5f7"><strong>Consulta:</strong><br />';
        $content .= $message->pergunta;
        $content .= '</div><br /><br /><div><strong>Resposta:</strong><br />';
        $content .= $message->resposta;
        $content .= '</div><br /><br /></body>';
        $content .= '<img src="' . url('api/public/signature.png') . '" height="120px" />';
        $content .= '</body>';
        return $decode ? utf8_decode($content) : $content;
    }
}
