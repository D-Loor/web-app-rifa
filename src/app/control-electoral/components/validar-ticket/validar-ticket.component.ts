import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validar-ticket',
  templateUrl: './validar-ticket.component.html',
  styleUrls: ['./validar-ticket.component.scss']
})
export class ValidarTicketComponent implements OnInit{
  codigoTicket: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codigoTicket = params.get('codigoTicket');
      console.log('ID del ticket:', this.codigoTicket);
    });
  }
}
