import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Editor } from 'ngx-editor';
import { CrudService } from 'src/app/services/crud.service';
import { ToolsService } from 'src/app/services/tools.service';
import { EditorComponent } from 'src/app/shared/editor/editor.component';
import { ContractBlocksComponent } from '../contract-blocks/contract-blocks.component';
import { ContractService } from '../contract.service';
import { ContractTypeFormComponent } from '../contrat-types/contract-type-form/contract-type-form.component';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
  providers: [CrudService],
})
export class ContractFormComponent implements OnInit {
  dados: any = { status: 1, blocks: [], text: '' };
  loading = false;
  typesContract: any[] = [];

  @ViewChild('editor') editor: EditorComponent | undefined;

  constructor(
    public tools: ToolsService,
    private modalCtrl: NgbModal,
    private service: CrudService,
    private contractService: ContractService,
    private routerActive: ActivatedRoute
  ) {
    service.setPath('contract');
  }

  ngOnInit(): void {
    this.getTypes();
    this.routerActive.params
      .subscribe((res: any) => {
        if (res.id_contract) {
          this.getDados(res.id_contract);
        }
      })
      .unsubscribe();
  }

  getDados(id: any) {
    this.loading = true;
    this.service
      .show(id)
      .then(async (res) => {
        this.dados = res.data;
      })
      .finally(() => (this.loading = false));
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.dados.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.loading = true;
    this.service
      .create(this.dados)
      .then((res) => {
        history.back();
      })
      .finally(() => (this.loading = false));
  }

  update() {
    this.loading = true;
    this.service
      .update(this.dados, this.dados.id)
      .then((res) => {
        history.back();
      })
      .finally(() => (this.loading = false));
  }

  getTypes() {
    this.contractService
      .listingTypes()
      .then((res) => (this.typesContract = res));
  }

  openAddTypeContract() {
    const modalRef = this.modalCtrl.open(ContractTypeFormComponent, {
      size: 'sm',
      animation: true,
      backdrop: 'static',
    });

    modalRef.result.then((res) => {
      if (res.data) {
        this.getTypes();
        this.dados.type_id = res.data.id;
      }
    });
  }

  addBloco() {
    const modalRef = this.modalCtrl.open(ContractBlocksComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.block_or_fields = this.dados.block_or_fields;

    modalRef.result.then((res) => {
      if (res) {
        // console.log('addBloco', res);
        this.editor?.appendText(`{{$${res.slug}}}`)
        // this.dados.text = `${this.dados.text} {{$${res.slug}}}`;
        // this.dados.blocks.push(res);
      }
    });
  }

  setField(field: any) {
    this.editor?.appendText(`{{$${field.slug}}}`);
    // this.dados.text = `${this.dados.text} <span>{{$${field.slug}}}</span>`;
  }
}
