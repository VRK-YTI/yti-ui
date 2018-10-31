import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export class Progress {
  current?: number;
  total?: number;
  label?: string;
  trackingError: boolean = false;

  get definite(): boolean {
    return typeof this.current === 'number';
  }

  get safeTotal(): number {
    return this.total || 100;
  }

  updateFrom(progress: Progress) {
    this.current = progress.current;
    this.total = progress.total;
    this.label = progress.label;
    this.trackingError = false;
  }
};

export class Phase {
  state: 'NOT_STARTED' | 'STARTED' | 'SUCCESS' | 'FAILURE' = 'NOT_STARTED';
  progress: Progress = new Progress();

  constructor(public titleKey: string, public start: (self: Phase, state: any) => Promise<any>, public poll?: (self: Phase, state: any) => Promise<Progress>, public cancel?: (self: Phase, state: any) => void) {}
};

export class Result {
  lastPhase?: Phase;
  success: boolean;
  result: any;
};

@Component({
  selector: 'app-progress',
  styleUrls: ['./progress.component.scss'],
  template: `
    <table class="bar-container">
      <tr class="phase" *ngFor="let phase of phases" [ngClass]="{'success': phase.state === 'SUCCESS', 'failure': phase.state === 'FAILURE'}">
        <td [ngSwitch]="phase.state" class="icon">
          <i *ngSwitchCase="'NOT_STARTED'" class="material-icons">hourglass_empty</i>
          <!-- <i *ngSwitchCase="'STARTED'" class="material-icons"></i> -->
          <i *ngSwitchCase="'SUCCESS'" class="material-icons">check_circle_outline</i>
          <i *ngSwitchCase="'FAILURE'" class="material-icons">error_outline</i>
        </td>
        <td class="title">{{phase.titleKey | translate}}</td>
        <td [ngSwitch]="phase.state" class="bar">
          <ngb-progressbar *ngSwitchCase="'NOT_STARTED'" type="info" [value]="0"></ngb-progressbar>
          <ngb-progressbar *ngSwitchCase="'STARTED'" [type]="phase.progress.trackingError ? 'danger' : 'info'" [value]="phase.progress.definite ? phase.progress.current : 100"
                           [max]="phase.progress.safeTotal" [striped]="!phase.progress.definite"
                           [animated]="!phase.progress.definite"></ngb-progressbar>
          <ngb-progressbar *ngSwitchCase="'SUCCESS'" type="success" [value]="phase.progress.safeTotal"
                           [max]="phase.progress.safeTotal"></ngb-progressbar>
          <ngb-progressbar *ngSwitchCase="'FAILURE'" type="danger" [value]="phase.progress.safeTotal"
                           [max]="phase.progress.safeTotal"></ngb-progressbar>
        </td>
      </tr>
    </table>
  `
})
export class ProgressComponent implements OnInit {
  @Input() phases: Phase[];
  @Input() state: any;
  @Output() result = new EventEmitter<Result>();
  private currentPhase = -1;
  private pollTimeout?: number;

  ngOnInit(): void {
    this.next();
  }

  private next(): void {
    this.currentPhase++;
    if (this.phases.length > this.currentPhase) {
      const phase = this.phases[this.currentPhase];
      phase.state = 'STARTED';
      window.setTimeout(() => {
        phase.start(phase, this.state).then((value: any) => {
          this.cancelPoll();
          phase.state = 'SUCCESS';
          this.state = value;
          window.setTimeout(() => this.next(), 0);
        }).catch((reason: any) => {
          this.cancelPoll();
          phase.state = 'FAILURE';
          this.result.emit({
            lastPhase: phase,
            success: false,
            result: reason
          });
        });
        if (phase.poll) {
          const poller = phase.poll;
          window.setTimeout(() => this.poll(poller, phase), 0);
        }
      }, 0);
    } else {
      this.result.emit({
        lastPhase: this.currentPhase >= 0 ? this.phases[this.currentPhase] : undefined,
        success: true,
        result: this.state
      });
    }
  }

  private poll(poller: (self: Phase, state: any) => Promise<Progress>, phase: Phase) {
    poller(phase, this.state).then((value: Progress) => {
      if (phase.state === 'STARTED') {
        phase.progress.updateFrom(value);
        this.pollTimeout = window.setTimeout(() => this.poll(poller, phase), 1000);
      }
    }).catch((reason: any) => {
      if (phase.state === 'STARTED') {
        phase.progress.current = undefined;
        phase.progress.trackingError = true;
      }
    });
  }

  private cancelPoll() {
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
      this.pollTimeout = undefined;
    }
  }
}
