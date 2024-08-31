# CodeSocket
A real-time code editor with a file explorer functionality.

![image](https://github.com/user-attachments/assets/02d9dad0-725c-4569-bf56-7f9ef34c13af)

## ⚙ Installation

Follow these steps to set up Stockify locally:

1. Fork and clone the repository: 
```
git clone https://github.com/your-username/codesocket.git
```

2. Install the required dependencies:
```
cd codesocket

cd client
  npm install
cd server
  npm install
```

3. Set up the configuration file:
- Create an .env file in the client folder of the codesocket
- Update the necessary environment variables in the `.env` and `.env.development` file.
```
client
.env.development
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
.env:
NEXT_PUBLIC_BACKEND_URL=<YOUR_HOSTED_BACKEND_URL>

```

4. Start the application:
```
For client: npm run dev
For server: npm run dev 
```

5. Access CodeSocket in your web browser at `http://localhost:3000`.

## Ports Used
* `:3000` - Client application runs on this port.
* `:8000` - Server and WebSocket services are hosted on this port.
    


