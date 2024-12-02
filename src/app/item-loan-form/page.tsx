import { ItemLoanForm } from '@/components/item-loan-form';

export default function ItemLoanPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <ItemLoanForm />
      </div>
    </main>
  );
} 