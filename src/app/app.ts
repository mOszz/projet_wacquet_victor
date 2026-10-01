import { Component } from '@angular/core';
import { RegisterForm } from './register-form/register-form';

@Component({
  imports: [RegisterForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}