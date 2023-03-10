import { Component, Input, OnInit } from '@angular/core';
import { SidebarInterface } from '../sidebar.interface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit(): void {}

  toggleMenu() {
    const body = document.getElementsByTagName('body')[0];
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    ) {
      body.classList.toggle('toggle-sidebar');
    }
  }
}
