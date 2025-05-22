"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileSchema = z.object({
  fullName: z.string().min(1, "Fullt navn er påkrevd"),
  address: z.string().min(1, "Adresse er påkrevd"),
  birthDate: z.string().min(1, "Fødselsdato er påkrevd"),
  phoneNumber: z.string().min(1, "Telefonnummer er påkrevd"),
  email: z.string().email("Ugyldig e-postadresse").min(1, "E-post er påkrevd"),
  notifications: z.coerce.boolean(),
  marketingNotifications: z.coerce.boolean(),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;

export function ProfileForm({
  value,
  action,
}: {
  value: Partial<ProfileFormSchema>;
  action: (value: ProfileFormSchema) => void;
}) {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: value,
  });

  const onSubmit = (data: ProfileFormSchema) => {
    action(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-12"
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-6xl font-extrabold italic">Min profil</h1>
          <p className="text-xl font-normal">
            Fyll gjerne inn ytterligere info om deg selv slik at vi mere presist
            kan jobbe for å gi deg gode lånetilbud.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-extrabold italic">Info om meg</h2>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullt navn</FormLabel>
                <FormControl>
                  <Input placeholder="Fullt navn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fødselsdato</FormLabel>
                <FormControl>
                  <Input placeholder="Fødselsdato" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonnummer</FormLabel>
                <FormControl>
                  <Input placeholder="Telefonnummer" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input placeholder="E-post" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-extrabold italic">Varslinger</h2>

          <FormField
            control={form.control}
            name="notifications"
            render={({ field }) => (
              <FormItem className="bg-card text-card-foreground flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Generelle varslinger
                  </FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Motta varslinger om lånetilbud og oppdateringer
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingNotifications"
            render={({ field }) => (
              <FormItem className="bg-card text-card-foreground flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Markedsføringsvarslinger
                  </FormLabel>
                  <FormDescription>
                    Motta informasjon om nye produkter og tjenester
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-start">
          <Button type="submit">Lagre endringer</Button>
        </div>
      </form>
    </Form>
  );
}
