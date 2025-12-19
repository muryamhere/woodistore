// This is a new file src/app/admin/dashboard/orders/[id]/_components/update-status-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/lib/actions';
import type { OrderStatus } from '@/lib/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


const statusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']),
});

type StatusFormValues = z.infer<typeof statusSchema>;


export function UpdateStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: currentStatus },
  });

  const { formState: { isSubmitting, isDirty } } = form;

  const onSubmit = async (data: StatusFormValues) => {
    try {
      await updateOrderStatus(orderId, data.status);
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${data.status}.`,
      });
      form.reset({ status: data.status }); // Reset form to new state
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh!',
        description: 'Failed to update order status.',
      });
    }
  };
  
  // Update form default value if the server component passes a new status
  useEffect(() => {
    form.reset({ status: currentStatus });
  }, [currentStatus, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
        </Button>
      </form>
    </Form>
  );
}
