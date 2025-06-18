import React from 'react';
import { fetchGlobals } from '@/directus/queries/globals';
import '@/app/globals.css';
import { ClientThemeWrapper } from '@/components/providers/ClientThemeWrapper';
import { FontVariablesSetter } from '@/components/providers/FontVariablesSetter';

const tailwindColors = { violet: '#8b5cf6', slate: '#64748b' };
const tailwindRadius = { xl: '1rem', lg: '0.5rem' };

// Create a theme context

export default async function SiteLayout(props: { children: React.ReactNode, params: { site: string, lang: string } }) {
  const { children } = props;
  const params = typeof (props.params as any)?.then === 'function' ? await (props.params as any) : props.params;

  const timestamp = new Date().toISOString();
  process.stdout.write(`\n[${timestamp}] 🏗️ SITE_LAYOUT: Starting layout render for site: ${params.site} lang: ${params.lang}\n`);
  
  const siteSlug = params.site;
  const lang = params.lang;

  // Fetch globals for this site
  process.stdout.write(`[${timestamp}] 📥 SITE_LAYOUT: Fetching globals...\n`);
  const globals = await fetchGlobals();
  const theme = globals?.translations?.[0]?.theme || {};
  process.stdout.write(`[${timestamp}] 📦 SITE_LAYOUT: Received globals: ${globals ? 'yes' : 'no'}\n`);
  
  // const theme = globals?.theme || {};
  process.stdout.write(`[${timestamp}] 🎨 SITE_LAYOUT: Theme data: ${JSON.stringify(theme, null, 2)}\n`);

  // Generate CSS variables from theme
  const styleVars = {
    '--color-primary': theme.primary || '#1E40AF',
    '--color-gray': theme.gray || '#1E293B',
    '--border-radius': theme.borderRadius || '1rem',
    '--font-display': theme.fonts?.families?.display || 'Poppins, sans-serif',
    '--font-body': theme.fonts?.families?.body || 'Inter, sans-serif',
    '--font-code': theme.fonts?.families?.code || 'Fira Code, monospace',
  };
  process.stdout.write(`[${timestamp}] 🎯 SITE_LAYOUT: Style variables: ${JSON.stringify(styleVars, null, 2)}\n`);

  const fontVars = {
    '--font-display': styleVars['--font-display'],
    '--font-body': styleVars['--font-body'],
    '--font-code': styleVars['--font-code'],
  };

  return (
    <>
      <FontVariablesSetter fontVars={fontVars} />
      <div style={styleVars as React.CSSProperties}>
        <ClientThemeWrapper theme={theme} globals={globals} styleVars={styleVars}>
          {children}
        </ClientThemeWrapper>
      </div>
    </>
  );
} 