import { filter } from 'rxjs/operators';
import { DebugElement } from "@angular/core"
import { HomeComponent } from "./home.component"
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {

  const begginerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  let component: HomeComponent,
      fixture: ComponentFixture<HomeComponent>,
      el: DebugElement,
      coursesService: any;

    beforeEach(waitForAsync(() => {

      const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

      TestBed.configureTestingModule({
        imports: [
          CoursesModule,
          NoopAnimationsModule
        ],
        providers: [
          {
            provide: CoursesService,
            useValue: coursesServiceSpy
          }
        ]
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

    }))

    it('should create the component', () => {
      expect(component).toBeTruthy();
    })


    it('should display only begginer courses', () => {
      coursesService.findAllCourses.and.returnValue(of(begginerCourses));
      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-mdc-tab'));

      expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    })

    it('should display only advanced courses', () => {
      coursesService.findAllCourses.and.returnValue(of(advancedCourses));
      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-mdc-tab'));

      expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    })

    it('should display both tabs', () => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-mdc-tab'));

      expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
    })

    it('should display advanced courses when tab clicked', (done: DoneFn) => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-mdc-tab'));
      click(tabs[1]);
      fixture.detectChanges();

      setTimeout(() => {
        fixture.detectChanges();
        const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));

        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

        done();
      }, 500);



    })
})
