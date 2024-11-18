export default function MDLink({ href, children }: { href: string, children: React.ReactNode }) {
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

  if (isInternalLink) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}