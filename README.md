# WealthWise

A Next.js application to track your personal finances, manage budgets, and visualize your spending habits.

## Features

- **Dashboard:** At-a-glance overview of your financial status, including total income, total expenses, and net balance.
- **Transaction Management:** Add, edit, and delete income and expense transactions.
- **Budgeting:** Set monthly budgets for different spending categories and track your progress.
- **Data Visualization:** Interactive charts to visualize your spending by category, monthly expenses over time, and compare your spending against your budgets.
- **Categorization:** Organize your transactions into customizable categories.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **UI:**
  - [React](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Recharts](https://recharts.org/) for charts
- **Form Management:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Linting:** [ESLint](https://eslint.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harishghasolia07/WealthWise.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your MongoDB connection string:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

```
.
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── budgets/
│   │   └── transactions/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── charts/           # Recharts components
│   └── ui/               # shadcn/ui components
├── data/                 # Static data
├── hooks/                # Custom React hooks
├── lib/                  # Library files
│   ├── models/           # Mongoose models
│   ├── mongodb.ts        # MongoDB connection
│   └── ...
├── public/               # Public assets
└── ...
```

## API Endpoints

- `GET /api/transactions`: Fetches all transactions.
- `POST /api/transactions`: Creates a new transaction.
- `PUT /api/transactions/[id]`: Updates a transaction.
- `DELETE /api/transactions/[id]`: Deletes a transaction.
- `GET /api/budgets`: Fetches all budgets.
- `POST /api/budgets`: Creates or updates budgets. 