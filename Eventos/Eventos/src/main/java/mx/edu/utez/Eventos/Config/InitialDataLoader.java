package mx.edu.utez.Eventos.Config;

import mx.edu.utez.Eventos.Model.Roles.RolBean;
import mx.edu.utez.Eventos.Model.Roles.RolRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InitialDataLoader implements CommandLineRunner {
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public InitialDataLoader (RolRepository rolRepository, UsuarioRepository usuarioRepository){
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
    }
    @Override
    public void run(String... args) throws Exception {
        if (rolRepository.count() == 0) {
            rolRepository.save(new RolBean(null, "Admin"));
            rolRepository.save(new RolBean(null, "Participante"));
            System.out.println("Datos iniciales cargados.");
        } else {
            System.out.println("Ya existen datos. No se cargaron datos iniciales.");
        }

        if(usuarioRepository.count() == 0) {
            RolBean rolAdmin = rolRepository.findAll()
                    .stream()
                    .filter(r -> r.getRol().equalsIgnoreCase("Admin"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Rol Admin no encontrado"));

            UsuarioBean usuarioAdmin = new UsuarioBean();
            usuarioAdmin.setNombre("Aministrador");
            usuarioAdmin.setApellido_paterno("Admin");
            usuarioAdmin.setApellido_materno("Admin");
            usuarioAdmin.setCorreo("admin@example.com");
            usuarioAdmin.setTelefono(null);
            String encrypted = passwordEncoder.encode("123456Aa#");
            usuarioAdmin.setPassword(encrypted);
            usuarioAdmin.setEstatus(Boolean.TRUE);
            usuarioAdmin.setRolBean(rolAdmin);

            usuarioRepository.save(usuarioAdmin);
            System.out.println("Usuario administrador cargado.");
        } else {
            System.out.println("Ya existen usuarios. No se cargaron datos iniciales de usuarios.");
        }
    }
}
