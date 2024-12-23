'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmailInputProps {
  label: string;
  value: string[];
  onChange: (emails: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function EmailInput({ label, value, onChange, error, disabled }: EmailInputProps) {
  const [currentEmail, setCurrentEmail] = useState('');

  const handleAdd = () => {
    if (currentEmail && !value.includes(currentEmail) && currentEmail.includes('@')) {
      onChange([...value, currentEmail]);
      setCurrentEmail('');
    }
  };

  const handleRemove = (email: string) => {
    onChange(value.filter(e => e !== email));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type="email"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Enter email address"
          disabled={disabled}
        />
        <Button 
          type="button"
          onClick={handleAdd}
          disabled={!currentEmail || disabled}
        >
          Add
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {value && value.map(email => (
          <Badge 
            key={email}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {email}
            <button
              type="button"
              onClick={() => handleRemove(email)}
              disabled={disabled}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}