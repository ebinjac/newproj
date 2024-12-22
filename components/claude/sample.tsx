// lib/validations/mail-group.ts
import { z } from 'zod';

const emailArray = z.array(z.string().email('Invalid email address')).default([]);

export const MailGroupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
  to: emailArray.min(1, 'At least one recipient is required'),
  cc: emailArray,
  bcc: emailArray,
  teamId: z.string().uuid('Invalid team ID'),
  applicationId: z.string().uuid('Invalid application ID').optional().nullable(),
});

export type MailGroupFormData = z.infer<typeof MailGroupSchema>;

// lib/types/action.ts
export type ActionState<T> = {
  data?: T;
  error?: {
    message: string;
    errors?: Record<string, string[]>;
  };
};

// app/actions/mail-group.ts
'use server'

import { db } from '@/db';
import { mailGroups } from '@/db/schema';
import { MailGroupSchema } from '@/lib/validations/mail-group';
import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/lib/types/action';

export async function createMailGroup(
  prevState: ActionState<{ id: string }> | null,
  formData: FormData
): Promise<ActionState<{ id: string }>> {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      to: formData.getAll('to').map(String),
      cc: formData.getAll('cc').map(String),
      bcc: formData.getAll('bcc').map(String),
      teamId: formData.get('teamId'),
      applicationId: formData.get('applicationId'),
    };

    const validatedData = MailGroupSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: {
          message: 'Validation failed',
          errors: validatedData.error.flatten().fieldErrors,
        },
      };
    }

    const result = await db.insert(mailGroups).values({
      ...validatedData.data,
      createdBy: 'user-id', // Replace with actual user ID from auth
      updatedBy: 'user-id', // Replace with actual user ID from auth
    }).returning({ id: mailGroups.id });

    revalidatePath('/mail-groups');
    
    return {
      data: {
        id: result[0].id,
      },
    };
  } catch (error) {
    console.error('Error creating mail group:', error);
    return {
      error: {
        message: 'Failed to create mail group. Please try again later.',
      },
    };
  }
}

// components/EmailInput.tsx
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

export function EmailInput({ label, value, onChange, error, disabled }: EmailInputProps) {
  const [currentEmail, setCurrentEmail] = useState('');

  const handleAdd = () => {
    if (currentEmail && !value.includes(currentEmail)) {
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
        {value.map(email => (
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

// app/mail-groups/create/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { experimental_useFormStatus as useFormStatus, experimental_useFormState as useFormState } from 'react-dom';
import type { MailGroupFormData } from '@/lib/validations/mail-group';
import { MailGroupSchema } from '@/lib/validations/mail-group';
import { createMailGroup } from '@/app/actions/mail-group';
import { EmailInput } from '@/components/EmailInput';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

const initialState = { message: null, errors: {} };

export default function CreateMailGroupPage() {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createMailGroup, initialState);

  const form = useForm<MailGroupFormData>({
    resolver: zodResolver(MailGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      to: [],
      cc: [],
      bcc: [],
      teamId: '', // Should be populated based on context/selection
      applicationId: null,
    },
  });

  async function onSubmit(data: MailGroupFormData) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    data.to.forEach(email => formData.append('to', email));
    data.cc.forEach(email => formData.append('cc', email));
    data.bcc.forEach(email => formData.append('bcc', email));
    formData.append('teamId', data.teamId);
    if (data.applicationId) {
      formData.append('applicationId', data.applicationId);
    }

    const result = await formAction(formData);

    if (result?.error) {
      if (result.error.errors) {
        Object.entries(result.error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof MailGroupFormData, {
            message: messages[0],
          });
        });
      } else {
        toast({
          title: 'Error',
          description: result.error.message,
          variant: 'destructive',
        });
      }
      return;
    }

    if (result?.data) {
      toast({
        title: 'Success',
        description: 'Mail group created successfully!',
      });
      router.push(`/mail-groups/${result.data.id}`);
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Mail Group</CardTitle>
          <CardDescription>
            Create a new mail group to organize email recipients.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action={formAction}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter group name" 
                        {...field} 
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter group description (optional)" 
                        {...field} 
                        disabled={pending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <EmailInput
                      label="To"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.to?.message}
                      disabled={pending}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                  <FormItem>
                    <EmailInput
                      label="CC"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.cc?.message}
                      disabled={pending}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bcc"
                render={({ field }) => (
                  <FormItem>
                    <EmailInput
                      label="BCC"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.bcc?.message}
                      disabled={pending}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      disabled={pending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an application" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Replace with actual applications data */}
                        <SelectItem value="app1">Application 1</SelectItem>
                        <SelectItem value="app2">Application 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Creating...' : 'Create Mail Group'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}