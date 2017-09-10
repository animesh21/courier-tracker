/**
 * Created by animesh on 30/8/17.
 */
import {Pipe} from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})
export class ReversePipe {

transform (values) {
    return values.reverse();
  }
}
