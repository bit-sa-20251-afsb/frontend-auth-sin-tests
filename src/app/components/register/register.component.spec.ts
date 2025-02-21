import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component"
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import Swal from "sweetalert2";

describe('RegisterCompenent', ()=>{
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const userEmail = 'email@email.com';
    const userPassword = 'password';
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

    it('Deberia retornar una respuesta cuando se registra un usuario', ()=>{
        // Arrange
        component.email = userEmail;
        component.password = userPassword;
        const mockSuccessResponse = {ok: true, msg: 'Usuario registrado correctamente'};
        authServiceSpy.register.and.returnValue(of(mockSuccessResponse));
        // Act
        component.onSubmit(new Event('submit'));
        // Assert
        expect(Swal.isVisible()).toBeTrue();
        expect(Swal.getTitle()?.textContent).toBe('Usuer Registered!!');
        expect(authServiceSpy.register).toHaveBeenCalledWith(userEmail,userPassword);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    })

    it('Deberia manejar una respuesta response.ok en false en el componente register', ()=>{
        // Arrange
        const mockFailedResponse = { ok: false, error:{msg:'Hubo un error al hacer la petición de register'}};
        authServiceSpy.register.and.returnValue(of(mockFailedResponse));
        // Act
        component.onSubmit(new Event('submit'));
        // Assert
        expect(Swal.isVisible()).toBeTrue();
        expect(Swal.getTitle()?.textContent).toBe('Algo salió mal en el backend');
    }
    )

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