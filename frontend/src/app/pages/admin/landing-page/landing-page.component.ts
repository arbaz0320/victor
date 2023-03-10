import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CrudService } from 'src/app/services/crud.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [CrudService],
})
export class LandingPageComponent implements OnInit {
  dados: any = { link_facebook: 'https://' };
  loading = false;
  typesContract: any[] = [];

  constructor(
    public tools: ToolsService,
    private service: CrudService
  ) {
    service.setPath('site-info');
  }

  ngOnInit(): void {
    this.getList();
  }

  async getList() {
    this.loading = true;
    await this.service
      .listing()
      .then((res) => {
        this.dados = res.data;
      })
      .finally(() => (this.loading = false));
  }

  update(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.loading = true;
    this.service
      .update(this.dados, this.dados.id)
      .then(async (res) => {
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }
}
