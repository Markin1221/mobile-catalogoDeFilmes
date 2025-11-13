import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTentativa',
  standalone: true,
})
export class StatusTentativaPipe implements PipeTransform {

  transform(vitoria: boolean, derrota: boolean): string {
      if (vitoria) return '😁 Você acertou!'
      if (derrota) return '😔Você perdeu...'
    return 'continue tentando!!';
  }

}
