<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContractGeneratedStoreRequest;
use App\Http\Requests\ContractGeneratedUpdateRequest;
use App\Http\Resources\ContractGeneratedResource;
use App\Models\ContractGenerated;
use Illuminate\Http\{
    Request,
    Response
};
use App\Models\Order;
use App\Services\HtmlToWord\HtmlToWordService;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContractGeneratedController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ContractGeneratedCollection
     */
    public function index(Request $request)
    {
        $contractGenerateds = ContractGenerated::where(['user_id' => auth()->user()->id])
            ->with(['order.contract'])
            ->orderBy('created_at', 'DESC')
            ->get();

        return response()->json(['data' => $contractGenerateds], Response::HTTP_OK);
    }

    /**
     * @param \App\Http\Requests\ContractGeneratedStoreRequest $request
     * @return \App\Http\Resources\ContractGeneratedResource
     */
    public function store(ContractGeneratedStoreRequest $request)
    {
        $contractGenerated = null;
        $order = Order::find($request->order_id);
        if ($order && in_array($order->status, ['approved', 'in_process'])) {
            $contractGenerated = ContractGenerated::create([
                'user_id' => auth()->user()->id,
                'signed' => false,
                'content' => $request->content,
                'json_response' => json_encode($request->only(['answers', 'blockAnswers'])),
                'order_id' => $request->order_id
            ]);

            try {
                Http::withToken(env('MAIL_PASSWORD'))->post('https://api.sendgrid.com/v3/mail/send', [
                    'from' => [
                        'email' => 'naoresponda@advogadossc.com'
                    ],
                    'personalizations' => [
                        [
                            'to' => [
                                [
                                    'email' => auth()->user()->email,
                                    'name' => auth()->user()->name
                                ]
                            ],
                            'dynamic_template_data' => [
                                'type' => 'contract',
                                'client_name' => auth()->user()->name,
                                'contract_name' => str_replace('Compra do contrato: ', '', $order->description),
                                'total' => $order->amount
                            ]
                        ]
                    ],
                    'template_id' => 'd-bb16f2a52752441f92eff978cb2a5af6'
                ]);
            } catch (\Exception $e) {
                Log::debug('Contract Sendgrid', $e->getMessage());
            }
        } else {
            return response()->json([
                'error'   => true,
                'message' => 'É necessário realizar a compra antes!',
            ], Response::HTTP_OK);
        }

        return response()->json([
            'error'   => !$contractGenerated,
            'data'    => $contractGenerated ? $contractGenerated : [],
            'message' => $contractGenerated ? 'Seu Contrato já está disponível em “Seus Contratos” no seu perfil.' : 'Erro ao gerar o contrato.',
        ], $contractGenerated ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ContractGenerated $contractGenerated
     * @return \App\Http\Resources\ContractGeneratedResource
     */
    public function show(Request $request, ContractGenerated $contractGenerated)
    {
        return new ContractGeneratedResource($contractGenerated);
    }

    /**
     * @param \App\Http\Requests\ContractGeneratedUpdateRequest $request
     * @param \App\Models\ContractGenerated $contractGenerated
     * @return \App\Http\Resources\ContractGeneratedResource
     */
    public function update(ContractGeneratedUpdateRequest $request, ContractGenerated $contractGenerated)
    {
        $contractGenerated->update($request->validated());

        return new ContractGeneratedResource($contractGenerated);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ContractGenerated $contractGenerated
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ContractGenerated $contractGenerated)
    {
        $contractGenerated->delete();

        return response()->noContent();
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function toPdf($id)
    {
        $contractGenerated = ContractGenerated::find($id);

        $pdf = App::make('snappy.pdf.wrapper');
        $pdf->loadHTML(
            $this->_getContent($contractGenerated, true)
        );
        $pdf->setOption('margin-top', '40mm');
        $pdf->setOption('margin-bottom', '20mm');
        $pdf->setOption('header-html', view('header_template_paper')->render());
        $pdf->setOption('footer-html', view('footer_template_paper')->render());
        return $pdf->inline();
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function toWord($id)
    {
        $contractGenerated = ContractGenerated::find($id);

        $word = new HtmlToWordService();
        $output = $word->createDoc(
            $this->_getContent($contractGenerated),
            str_replace('Compra do contrato: ', '', $contractGenerated->order->description)
        );

        $tmpFile = tempnam(sys_get_temp_dir(), 'contract_');
        file_put_contents($tmpFile, $output);
        return response()->download(
            $tmpFile,
            'contract.doc',
            ['Content-Type' => 'application/octet-stream']
        )->deleteFileAfterSend(true);
    }

    public function _getContent($contractGenerated, $decode = false)
    {
        $contractName = str_replace('Compra do contrato: ', '', $contractGenerated->order->description);
        $content = '<style>
            @import url(\'https://fonts.googleapis.com/css2?family=Montserrat&display=swap\');
            .watermark {
                background: url(\'' . url('api/public/marca-dagua.png') . '\') 0 0 !important;
                background-position: center;
                background-repeat: repeat-y;
                background-size: 100%;
                background-attachment: fixed;
                font-family: \'Montserrat\', sans-serif;
            }
        </style>';
        $content .= '<body class="watermark">';
        $content .= '<h2 style="text-align:center">' . $contractName . '</h2>';
        $content .= '<br />';
        $content .= str_replace(
            ['–', '‘', '’', '‚', '“', '”', ' '],
            ['&ndash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&nbsp;'],
            $contractGenerated->content
        );
        $content .= '</body>';
        return $decode ? utf8_decode($content) : $content;
    }
}
