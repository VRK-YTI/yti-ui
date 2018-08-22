import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router, UrlMatcher, UrlSegment, UrlSegmentGroup} from "@angular/router";

/**
 * Dummy component (router endpoint) that can be used as a transitional target for performing view re-initialization.
 * Can be used either like
 * ```
 * router.navigate(['re'], {skipLocationChange: true}).then(() => router.navigate(['ori', 'gin', 'al'], {skipLocationChange: true}));
 * ```
 * or like
 * ```
 * router.navigate(['re', 'ori', 'gin', 'al'], {skipLocationChange: true});
 * ```
 */
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

export function createRefreshRouteMatcher(path: string[]) : UrlMatcher {
  return (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
    if (segments.length >= path.length) {
      if (path.reduce((matching: boolean, current: string, index: number, arr: string[]) => {
        return matching && current === segments[index].path;
      }, true)) {
        return {
          consumed: segments
        };
      }
    }
    return {
      consumed: []
    };
  }
}
