# ReactAppC
## Overview

ReactAppC is a full-stack web application developed with React, TypeScript, and Vite for the client side and ASP.NET Core for the server side. This application demonstrates the integration of a modern React frontend with a robust .NET backend.
Features

    Client:
        Built with React and TypeScript.
        Utilizes Vite for fast development and build processes.
        Includes routing, state management, and API integration.
        Styled using Tailwind CSS.
        Components for Home, About, Contact, Playlist, and Views pages.
    Server:
        Built with ASP.NET Core Web API.
        Entity Framework Core for database interactions.
        Controllers for handling Playlists and WeatherForecast.
        Swagger/OpenAPI for API documentation.

Getting Started
Prerequisites

    Node.js
    .NET SDK

Installation

    Clone the repository:

    sh

    git clone https://github.com/Jabril-Mahamud/ReactAppC.git

    cd ReactAppC

Install client dependencies:

    sh
    cd reactappc.client
    npm install

Install server dependencies:

    sh

    cd ../ReactAppC.Server
    dotnet restore

Running the Application

    Start the server:

    sh

    cd ReactAppC.Server
    dotnet run
  
Start the client:

    sh

    cd ../reactappc.client
    npm run dev

    Open your browser and navigate to https://localhost:7294 for the server and https://localhost:5173 for the client.

Project Structure

    ReactAppC
    ├── ReactAppC.Server
    │   ├── Controllers
    │   │   ├── PlaylistsController.cs
    │   │   └── WeatherForecastController.cs
    │   ├── Data
    │   │   └── PlaylistContext.cs
    │   ├── Migrations
    │   │   ├── 20240705202100_IntialCreate.Designer.cs
    │   │   ├── 20240705202100_IntialCreate.cs
    │   │   └── ApplicationDbContextModelSnapshot.cs
    │   ├── Models
    │   │   ├── Playlist.cs
    │   │   └── WeatherForecast.cs
    │   ├── Program.cs
    │   ├── Properties
    │   │   └── launchSettings.json
    │   └── appsettings.json
    └── reactappc.client
        ├── public
        │   └── vite.svg
        ├── src
        │   ├── App.tsx
        │   ├── Navbar
        │   │   └── Navbar.tsx
        │   ├── assets
        │   │   └── react.svg
        │   ├── index.css
        │   ├── main.tsx
        │   ├── pages
        │   │   ├── About.tsx
        │   │   ├── Contact.tsx
        │   │   ├── Home.tsx
        │   │   ├── Playlist.tsx
        │   │   └── Views.tsx
        ├── .eslintrc.cjs
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── tsconfig.json
        ├── tsconfig.node.json
        └── vite.config.ts
    
Additional Information

For more details on the configuration and setup, please refer to the CHANGELOG.md files located in both the client and server directories.
