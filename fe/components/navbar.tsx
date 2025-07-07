'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Menu, User, Package, Calculator, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative container mx-auto flex h-16 items-center justify-between max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-2"
            prefetch={true}
          >
            <Package className="h-6 w-6" />
            <span className="text-xl font-bold">Doel3D</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Calculator className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            3D Print Calculator
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Hitung estimasi biaya cetak 3D dengan
                            akurat berdasarkan file STL Anda.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem
                      href="/estimate"
                      title="Estimasi Biaya"
                    >
                      Upload file STL dan dapatkan estimasi biaya
                      secara instan
                    </ListItem>
                    <ListItem
                      href="/order"
                      title="Order Sekarang"
                    >
                      Langsung order melalui Tokopedia dengan estimasi
                      yang akurat
                    </ListItem>
                    <ListItem
                      href="/history"
                      title="Riwayat Order"
                    >
                      Lihat riwayat estimasi dan order yang pernah
                      dibuat
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link
                    href="/estimate"
                    prefetch={true}
                  >
                    Estimasi
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href="/about">Tentang</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href="/contact">Kontak</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* CTA Button */}
          <Button
            asChild
            className="hidden sm:flex"
          >
            <Link
              href="/estimate"
              prefetch={true}
            >
              Mulai Estimasi
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/avatar.png"
                    alt="User"
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              forceMount
            >
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history">
                  <Package className="mr-2 h-4 w-4" />
                  Riwayat Order
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Info className="mr-2 h-4 w-4" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
            >
              <DropdownMenuItem asChild>
                <Link href="/estimate">
                  <Calculator className="mr-2 h-4 w-4" />
                  Estimasi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">
                  <Info className="mr-2 h-4 w-4" />
                  Tentang
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">
                  <User className="mr-2 h-4 w-4" />
                  Kontak
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

const navigationMenuTriggerStyle = () =>
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50';
