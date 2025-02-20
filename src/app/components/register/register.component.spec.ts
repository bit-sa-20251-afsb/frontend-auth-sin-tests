import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component"
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import Swal from "sweetalert2";

describe('RegisterCompenent', ()=>{
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async ()=>{
        const authObjSpy = jasmine.createSpyObj('AuthService',['register']);
        const routerObjSpy = jasmine.createSpyObj('Router',['navigate']);
        await TestBed.configureTestingModule({
            imports: [RegisterComponent],
            providers:[{provide: AuthService, useValue: authObjSpy},
                {provide: Router, useValue: routerObjSpy}]
        }).compileComponents();
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        fixture.detectChanges();
    });
    
    it('should create', ()=>{
        expect(component).toBeTruthy();
    })

    it('Deberia manejar el error en el componente register', ()=>{
        // Arrange
        const mockErrorResponse = {error:{msg:'Error inesperado del backend'}};
        authServiceSpy.register.and.returnValue(throwError(mockErrorResponse));
        // Act
        component.onSubmit(new Event('submit'));
        // Assert
        expect(Swal.isVisible()).toBeTrue();
        expect(Swal.getTitle()?.textContent).toBe('Hubo un error al hacer la petición');
    })
})