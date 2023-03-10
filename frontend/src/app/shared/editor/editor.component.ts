import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToolsService } from 'src/app/services/tools.service';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public editor = Editor;

  @Input()
  form!: NgForm;

  @Input()
  atributo!: string;

  @Input()
  dados: any;

  @Input()
  value: any;

  @Input()
  requerido: boolean = false;

  @ViewChild('scEditor') editorComponent: CKEditorComponent | undefined;

  constructor(public tools: ToolsService) {}

  ngOnInit(): void {
    // setTimeout(() => {
    //   // this.initEditor();
    // }, 300);
  }

  public appendText(text: string) {
    const instanceEditor = this.editorComponent?.editorInstance;
    // console.log('instanceEditor', instanceEditor);
    if (instanceEditor) {
      const viewFragment = instanceEditor.data.processor.toView(text);
      // console.log('viewFragment', viewFragment);
      const modelFragment = instanceEditor.data.toModel(viewFragment);
      // console.log('modelFragment', modelFragment);
      instanceEditor.model.insertContent(
        modelFragment,
        instanceEditor.model.document.selection
      );
    }
  }

  initEditor() {
    const sc_editor: HTMLElement | null = document.querySelector('#sc-editor');
    if (sc_editor) {
      this.editor
        .create(sc_editor, {
          removePlugins: ['title'],
        })
        .then((editor: any) => {
          editor.setData(this.value);
          this.editor = editor;
        })
        .catch((error: any) => {
          console.error('Ocorreu um problema ao inicializar o editor.', error);
        });
    }
  }
}
