import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-refresh',
  styleUrls: ['./refresh.component.scss'],
  template: `
    <span></span>
  `
})
export class RefreshComponent implements OnInit, OnDestroy {
  private sub?: any;

  constructor(private route : ActivatedRoute, private router : Router) {
  }

  ngOnInit(): void {
    this.sub = this.route.url.subscribe((urlSegments: UrlSegment[]) => {
        if(urlSegments.length > 1) {
          let pathStrings = urlSegments.slice(1).map(segment => segment.path);
          setTimeout(() => this.router.navigate(pathStrings, {skipLocationChange: true}));
        }
      });
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
