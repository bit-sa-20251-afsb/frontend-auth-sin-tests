import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";


describe('AuthService Tests',()=>{
    const mockToken = 'test-token';
    const mockUserName = 'test-user';
    const mockPassword = 'test-password';
    let service: AuthService;
    let httpMock: HttpTestingController;
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach( ()=>{
        httpMock.verify();
    });

    it('should be created', ()=> { 
        expect(service).toBeTruthy();
    });

    it('Deberia poder hacer una llamada al endpoint /register y devolver un resultado', ()=>{
        // Arrange
        const mockResponse = {msg: 'Usuario registrado satisfactoriamente'};
        // Act & Assert
        service.register(mockUserName,mockPassword).subscribe(
            response =>{
                expect(response).toEqual(mockResponse);
            }
        );
        const req = httpMock.expectOne(`${service['apiUrl']}/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({email:mockUserName, password: mockPassword});
        req.flush(mockResponse);
    });

    it('Deberia poder hacer una llamada al endpoint /login y devolver un resultado', ()=>{
        // Arrange
        const mockResponse = {msg: 'Usuario registrado satisfactoriamente'};
        // Act & Assert
        service.login(mockUserName,mockPassword).subscribe(
            response =>{
                expect(response).toEqual(mockResponse);
            }
        );
        const req = httpMock.expectOne(`${service['apiUrl']}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({email:mockUserName, password: mockPassword});
        req.flush(mockResponse);
    });

    it('Deberia tener un token en el session stage',()=>{
        // Arrage
        sessionStorage.setItem('token',mockToken);
        // Act
        const result = service.isLoggedIn();
        // Assert
        expect(result).toBeTruthy();
    })

    it('Deberia probar getToken()',()=>{
        // Arrange
        sessionStorage.setItem('token',mockToken);
        // Act
        const expectedToken = service.getToken();
        // Assert
        expect(expectedToken).toBe(mockToken);
    });

    it('Deberia probar logout()', ()=>{
        // Arrange
        sessionStorage.setItem('token',mockToken);
        // Act
        service.logout();
        // Assert
        expect(sessionStorage.getItem('token')).toBeFalsy();
        expect(sessionStorage.getItem('token')).toBeNull();
    })
})