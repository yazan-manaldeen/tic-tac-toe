import {animate, state, style, transition, trigger} from '@angular/animations';
import {animationCurves, animationDurations} from "@app/animations/animations-config";


const zoomIn = trigger('zoomIn',
  [
    state('void',
      style({
        opacity: 0,
        transform: 'scale(0)',
      }),
    ),
    state('*',
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),
    transition('void => false', []),
    transition('void => *', animate('{{timings}}'),
      {
        params: {
          timings: `${animationDurations.entering} ${animationCurves.deceleration}`,
        },
      },
    ),
  ],
);

const zoomOut = trigger('zoomOut',
  [
    state('*',
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),
    state('void',
      style({
        opacity: 0,
        transform: 'scale(0)',
      }),
    ),
    transition('false => void', []),
    transition('* => void', animate('{{timings}}'),
      {
        params: {
          timings: `${animationDurations.exiting} ${animationCurves.acceleration}`,
        },
      },
    ),
  ],
);

export {zoomIn, zoomOut};
