import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor() {}

  getValidateInput(form: NgForm, inputName: string) {
    const control = form.controls[inputName];
    if (
      control &&
      control.status == 'INVALID' &&
      (form.submitted || form.touched)
    ) {
      return true;
    }

    return false;
  }

  getInitials(str: any) {
    if (!str) {
      return false;
    }

    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...str.matchAll(rgx)] || [];

    return (initials = (
      (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
    ).toUpperCase());
  }

  getTime(data: any) {
    let now = moment(new Date()).locale('pt-br');
    let before = moment(new Date(data)).locale('pt-br');

    let diff = moment.duration(now.diff(before));
    const anos = parseInt(diff.asYears().toFixed(0));
    const meses = parseInt(diff.asMonths().toFixed(0));
    const weeks = parseInt(diff.asWeeks().toFixed(0));
    const days = parseInt(diff.asDays().toFixed(0));
    const hours = parseInt(diff.asHours().toFixed(0));
    const minutes = parseInt(diff.asMinutes().toFixed(0));
    const seconds = parseInt(diff.asSeconds().toFixed(0));

    if (anos > 0) {
      if (anos == 1) {
        return `${anos} ano atrás`;
      }
      return `${anos} anos atrás`;
    }
    if (meses > 0) {
      if (meses == 1) {
        return `${meses} mês atrás`;
      }
      return `${meses} meses atrás`;
    }
    if (weeks > 0) {
      if (weeks == 1) {
        return `${weeks} semana atrás`;
      }
      return `${weeks} semanas atrás`;
    }
    if (days > 0) {
      if (days == 1) {
        return `${days} dia atrás`;
      }
      return `${days} dias atrás`;
    }
    if (hours > 0) {
      if (hours == 1) {
        return `${hours} hora atrás`;
      }
      return `${hours} horas atrás`;
    }
    if (minutes > 0) {
      if (minutes == 1) {
        return `${minutes} minuto atrás`;
      }
      return `${minutes} minutos atrás`;
    }
    if (seconds > 0) {
      if (seconds == 1) {
        return `${seconds} segundo atrás`;
      }
      return `${seconds} segundos atrás`;
    }
    return ``;
  }

  getMessageNotRead(messages: any[]) {
    let total = 0;
    messages.forEach((m) => {
      if (!m.read) {
        total++;
      }
    });
    return total;
  }

  getLength(string: string, limit: number) {
    if (!string) {
      return limit;
    }
    return limit - string.length;
  }
}
