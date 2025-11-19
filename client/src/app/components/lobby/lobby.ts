import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameSocketService } from '../../services/game-socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss'
})
export class LobbyComponent implements OnInit, OnDestroy {
  username = '';
  gameId = '';
  isConnected = false;
  isLoading = false;
  errorMessage = '';
  currentGameId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private socketService: GameSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Connect to socket if not already connected
    if (!this.socketService.isConnected()) {
      this.socketService.connect();
    }

    // Subscribe to connection status
    this.socketService.connected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isConnected => {
        this.isConnected = isConnected;
        if (isConnected) {
          this.errorMessage = '';
        }
      });

    // Subscribe to game creation
    this.socketService.gameCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.currentGameId = response.gameId;
        this.isLoading = false;
        console.log('✅ Game created! Game ID:', this.currentGameId);
        // Auto-navigate to game after a short delay
        setTimeout(() => this.router.navigate(['/game']), 500);
      });

    // Subscribe to game joined
    this.socketService.joinedGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.currentGameId = response.gameId;
        this.isLoading = false;
        console.log('✅ Joined game! Game ID:', this.currentGameId);
        // Auto-navigate to game after a short delay
        setTimeout(() => this.router.navigate(['/game']), 500);
      });

    // Subscribe to errors
    this.socketService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: any) => {
        this.errorMessage = error?.message || 'An error occurred. Please try again.';
        this.isLoading = false;
        console.error('❌ Error:', error);
      });
  }

  /**
   * Create a new game room
   */
  createGame(): void {
    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username';
      return;
    }

    if (!this.isConnected) {
      this.errorMessage = 'Not connected to server. Please refresh the page.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('🎮 Creating game with username:', this.username);
    this.socketService.createGame({ username: this.username });
  }

  /**
   * Join an existing game room
   */
  joinGame(): void {
    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username';
      return;
    }

    if (!this.gameId.trim()) {
      this.errorMessage = 'Please enter a Game ID';
      return;
    }

    if (!this.isConnected) {
      this.errorMessage = 'Not connected to server. Please refresh the page.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('🎮 Joining game:', this.gameId, 'as', this.username);
    this.socketService.joinGame({
      gameId: this.gameId,
      username: this.username
    });
  }

  /**
   * Copy game ID to clipboard
   */
  copyGameId(): void {
    if (this.currentGameId) {
      navigator.clipboard.writeText(this.currentGameId).then(() => {
        console.log('✅ Game ID copied to clipboard!');
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
