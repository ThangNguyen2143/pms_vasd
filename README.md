# Project Guide: PMS_VASD

## Introduction

This project is designed to manage and streamline processes for PMS_VASD. Follow the steps below to set up and use the project effectively.

## Prerequisites

- **Programming Language**: Ensure you have [language] installed (e.g., Python, Node.js, etc.).
- **Dependencies**: Install required dependencies listed in `package.json`.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thangnguyen2143/pms_vasd.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pms_vasd
   ```
   OR extract folder pms_vasd.zip and navigate to project.
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

if you clone repository from git you need:

1. Copy the example configuration file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your environment-specific variables.
   if you want to config host, try to change
   "scripts":{
   ...
   "start": "next start -H {ip host} -p {port}"
   ...
   }

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. Access the application at your ip config or default at "http://localhost:3000"

## Testing

Run the test suite to ensure everything is working:

```bash
npm test
```

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Submit a pull request.

## License

This project is licensed under the [CongThangNguyen]. See the `LICENSE` file for details.

## Support

For issues or questions, open an issue in the repository or contact the maintainers.
