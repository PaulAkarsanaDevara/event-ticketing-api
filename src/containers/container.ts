import { container } from 'tsyringe';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/users/user.service';
import { EventService } from '../modules/events/event.service';

// Register services
container.register('UserService', { useClass: UserService});
container.register('AuthService', { useClass: AuthService });
container.register('EventService', { useClass: EventService });

export { container }