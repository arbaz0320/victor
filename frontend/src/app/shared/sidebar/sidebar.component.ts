import { Component, OnInit } from '@angular/core';
import { SidebarInterface } from './sidebar.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menu: SidebarInterface[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'bi bi-grid',
    },
    {
      id: 'contratos',
      title: 'Contratos',
      route: '/contracts',
      icon: 'bi bi-file-text',
    },
    {
      id: 'cupons',
      title: 'Cupons',
      route: '/cupons',
      icon: 'bx bx-purchase-tag-alt',
    },
    {
      id: 'plans',
      title: 'Planos',
      route: '/plans',
      icon: 'bx bx-coin-stack',
    },
    {
      id: 'faq',
      title: 'FAQ',
      route: '/faq',
      icon: 'bx bx-question-mark',
    },
    {
      id: 'chat',
      title: 'Mensagens',
      route: '/chat',
      icon: 'bi bi-chat-left-text',
    },
    {
      id: 'site',
      title: 'Configurações',
      route: '/settings',
      icon: 'bx bxs-cog',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
