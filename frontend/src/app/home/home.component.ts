import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-home',
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  isAdmin = localStorage.getItem('role') === 'admin';
}
