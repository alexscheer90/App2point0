import { Game, NewsItem } from '@shared/schema';

interface WebSocketCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onGameUpdate?: (game: Game) => void;
  onNewsUpdate?: (news: NewsItem) => void;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  /**
   * Connect to the WebSocket server
   */
  connect(callbacks: WebSocketCallbacks = {}) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected');
      return;
    }

    this.callbacks = callbacks;

    // Get the correct protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        if (this.callbacks.onOpen) {
          this.callbacks.onOpen();
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected', event);
        
        if (this.callbacks.onClose) {
          this.callbacks.onClose();
        }

        // Try to reconnect if the connection was closed unexpectedly
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          console.log(`Attempting to reconnect in ${delay / 1000} seconds`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connect(this.callbacks);
          }, delay);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.callbacks.onError) {
          this.callbacks.onError(error);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'game_update' && this.callbacks.onGameUpdate) {
            this.callbacks.onGameUpdate(data.payload as Game);
          } else if (data.type === 'news_update' && this.callbacks.onNewsUpdate) {
            this.callbacks.onNewsUpdate(data.payload as NewsItem);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error as Event);
      }
    }
  }

  /**
   * Check if the WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Send a message to the WebSocket server
   */
  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
   * Subscribe to a specific channel
   */
  subscribe(channel: string) {
    this.send({
      type: 'subscribe',
      channel,
    });
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channel: string) {
    this.send({
      type: 'unsubscribe',
      channel,
    });
  }
}

export const webSocketService = new WebSocketService();