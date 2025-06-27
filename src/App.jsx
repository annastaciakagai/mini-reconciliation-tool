import { useState } from "react";
import FileUpload from "./FileUpload";
import Output from './Output'
import Papa from "papaparse";

function reconcileData(internal, provider) {
  const internalMap = new Map(internal.map(tx => [tx.transaction_reference, tx]));
  const providerMap = new Map(provider.map(tx => [tx.transaction_reference, tx]));

  const matched = [];
  const onlyInternal = [];
  const onlyProvider = [];

  // Find matched and only-in-internal
  for (const [ref, tx] of internalMap) {
    if (providerMap.has(ref)) {
      const providerTx = providerMap.get(ref);
      const isAmountMatch = tx.amount === providerTx.amount;
      const isStatusMatch = tx.status === providerTx.status;
      matched.push({
        ...tx,
        providerAmount: providerTx.amount,
        providerStatus: providerTx.status,
        isAmountMatch,
        isStatusMatch,
      });
    } else {
      onlyInternal.push(tx);
    }
  }

  // Find only-in-provider
  for (const [ref, tx] of providerMap) {
    if (!internalMap.has(ref)) {
      onlyProvider.push(tx);
    }
  }

  return { matched, onlyInternal, onlyProvider };
}

export default function App() {
  const [results, setResults] = useState(null);

  const handleFiles = (internalFile, providerFile) => {
    Papa.parse(internalFile, {
      header: true,
      skipEmptyLines: true,
      complete: (internalResult) => {
        Papa.parse(providerFile, {
          header: true,
          skipEmptyLines: true,
          complete: (providerResult) => {
            setResults(reconcileData(internalResult.data, providerResult.data));
          },
        });
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Reconciliation Tool</h1>
      <FileUpload onFilesSelected={handleFiles} />
      {results && <Output {...results} />}
    </div>
  );
}