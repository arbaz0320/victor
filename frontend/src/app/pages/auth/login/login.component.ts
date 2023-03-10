import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToolsService } from 'src/app/services/tools.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  constructor(private service: AuthService, public tools: ToolsService) {}

  ngOnInit(): void {}

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const data = {
      email: form.control.get('email')?.value,
      password: form.control.get('password')?.value,
      origin: 'admin',
    };

    this.loading = true;
    this.service
      .login(data)
      .then((res) => {
        localStorage.setItem(environment.authTokenKey, res.access_token);
        location.href = '/';
      })
      .finally(() => (this.loading = false));
  }
}
