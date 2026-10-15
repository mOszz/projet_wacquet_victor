import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RegisteredUser } from '../../models/user.model';

/** Presentational component: displays the account returned by the API. */
@Component({
  selector: 'app-register-result',
  imports: [DatePipe],
  templateUrl: './register-result.html',
  styleUrl: './register-result.css',
})
export class RegisterResult {
  @Input({ required: true }) user!: RegisteredUser;
}
