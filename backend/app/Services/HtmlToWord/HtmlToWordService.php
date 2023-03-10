<?php

namespace App\Services\HtmlToWord;

/**
 * Convert HTML to MS Word document
 * @name HtmlToWordService
 * @version 2.0
 * @author CodexWorld
 * @link https://www.codexworld.com
 */
class HtmlToWordService
{
    private $_docFile  = '';
    private $_title    = '';
    private $_htmlHead = '';
    private $_htmlBody = '';

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct()
    {
        $this->_title = '';
        $this->_htmlHead = '';
        $this->_htmlBody = '';
    }

    /**
     * Set the document file name
     *
     * @param String $docfile
     */
    private function _setDocFileName($docfile)
    {
        $this->_docFile = $docfile;
        if (!preg_match("/\.doc$/i", $this->_docFile) && !preg_match("/\.docx$/i", $this->_docFile)) {
            $this->_docFile .= '.doc';
        }
        return;
    }

    /**
     * Set the document title
     *
     * @param String $title
     */
    public function setTitle($title)
    {
        $this->_title = $title;
    }

    /**
     * Return header of MS Doc
     *
     * @return String
     */
    private function _getHeader()
    {
        $return = <<<EOH
        <html xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">

        <head>
        <meta http-equiv=Content-Type content="text/html; charset=utf-8">
        <meta name=ProgId content=Word.Document>
        <meta name=Generator content="Microsoft Word 9">
        <meta name=Originator content="Microsoft Word 9">
        <!--[if !mso]>
        <style>
        v\:* {behavior:url(#default#VML);}
        o\:* {behavior:url(#default#VML);}
        w\:* {behavior:url(#default#VML);}
        .shape {behavior:url(#default#VML);}
        </style>
        <![endif]-->
        <title>$this->_title</title>
        <!--[if gte mso 9]><xml>
         <w:WordDocument>
          <w:View>Print</w:View>
          <w:DoNotHyphenateCaps/>
          <w:PunctuationKerning/>
          <w:DrawingGridHorizontalSpacing>9.35 pt</w:DrawingGridHorizontalSpacing>
          <w:DrawingGridVerticalSpacing>9.35 pt</w:DrawingGridVerticalSpacing>
         </w:WordDocument>
        </xml><![endif]-->
        <style>
        <!--
         /* Font Definitions */
        @font-face
            {font-family:Verdana;
            panose-1:2 11 6 4 3 5 4 4 2 4;
            mso-font-charset:0;
            mso-generic-font-family:swiss;
            mso-font-pitch:variable;
            mso-font-signature:536871559 0 0 0 415 0;}
         /* Style Definitions */
        p.MsoNormal, li.MsoNormal, div.MsoNormal
            {mso-style-parent:"";
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:7.5pt;
                mso-bidi-font-size:8.0pt;
            font-family:"Verdana";
            mso-fareast-font-family:"Verdana";}
        p.small
            {mso-style-parent:"";
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:1.0pt;
                mso-bidi-font-size:1.0pt;
            font-family:"Verdana";
            mso-fareast-font-family:"Verdana";}
        @page Section1
            {size:8.5in 11.0in;
            margin:1.0in 1.25in 1.0in 1.25in;
            mso-header-margin:.5in;
            mso-footer-margin:.5in;
            mso-paper-source:0;}
        div.Section1
            {page:Section1;}
        -->
        </style>
        <!--[if gte mso 9]><xml>
         <o:shapedefaults v:ext="edit" spidmax="1032">
          <o:colormenu v:ext="edit" strokecolor="none"/>
         </o:shapedefaults></xml><![endif]--><!--[if gte mso 9]><xml>
         <o:shapelayout v:ext="edit">
          <o:idmap v:ext="edit" data="1"/>
         </o:shapelayout></xml><![endif]-->
         $this->_htmlHead
        </head>
        <body>
EOH;
        return $return;
    }

    /**
     * Return Document footer
     *
     * @return String
     */
    private function _getFotter()
    {
        return "</body></html>";
    }

    /**
     * Create The MS Word Document from given HTML
     *
     * @param String $html :: HTML Content or HTML File Name like path/to/html/file.html
     * @param String $file :: Document File Name
     * @param Boolean $download :: Wheather to download the file or save the file
     * @return boolean
     */
    public function createDoc($html, $file, $download = false)
    {
        if (strlen($html) < 100 && is_file($html)) {
            $html = @file_get_contents($html);
        }

        $this->_parseHtml($html);
        $this->_setDocFileName($file);
        $doc = $this->_getHeader();
        $doc .= $this->_htmlBody;
        $doc .= $this->_getFotter();

        if ($download) {
            @header("Cache-Control: "); // leave blank to avoid IE errors
            @header("Pragma: "); // leave blank to avoid IE errors
            @header("Content-type: application/octet-stream");
            @header("Content-Disposition: attachment; filename=\"$this->_docFile\"");
            echo $doc;
            return true;
        } else {
            return $doc;
        }
    }

    /**
     * Parse the html and remove <head></head> part if present into html
     *
     * @param String $html
     * @return void
     * @access Private
     */
    private function _parseHtml($html)
    {
        $html = preg_replace("/<!DOCTYPE((.|\n)*?)>/ims", "", $html);
        $html = preg_replace("/<script((.|\n)*?)>((.|\n)*?)<\/script>/ims", "", $html);
        preg_match("/<head>((.|\n)*?)<\/head>/ims", $html, $matches);
        $head = !empty($matches[1]) ? $matches[1] : '';
        preg_match("/<title>((.|\n)*?)<\/title>/ims", $head, $matches);
        $this->_title = !empty($matches[1]) ? $matches[1] : '';
        $html = preg_replace("/<head>((.|\n)*?)<\/head>/ims", "", $html);
        $head = preg_replace("/<title>((.|\n)*?)<\/title>/ims", "", $head);
        $head = preg_replace("/<\/?head>/ims", "", $head);
        $html = preg_replace("/<\/?body((.|\n)*?)>/ims", "", $html);
        $this->_htmlHead = $head;
        $this->_htmlBody = $html;
        return;
    }
}
