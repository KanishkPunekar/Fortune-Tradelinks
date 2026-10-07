import type { Client, ClientService } from '../config/site';

/**
 * Logo files in src/assets/clients/, found at build time: a file named after a client's slug
 * (e.g. nayara-energy.png) is used automatically. Vite fingerprints and serves them.
 */
const logoFiles = import.meta.glob<string>('../assets/clients/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function logoFor(slug: string): string | undefined {
  const match = Object.keys(logoFiles).find((file) => file.replace(/^.*\/|\.[^.]+$/g, '') === slug);
  return match ? logoFiles[match] : undefined;
}

/** [PROPOSED COPY] Service labels under each client's name. */
const SERVICE_LABELS: Record<ClientService, string> = {
  ethanol: 'Ethanol supply',
  logistics: 'Logistics services',
};

/** Client logo wall: logo on a white plate (readable in both themes), name, and what we do for them. */
export function ClientLogos({ clients }: { clients: Client[] }) {
  return (
    <ul className="client-logos" role="list">
      {clients.map((client) => {
        const logo = logoFor(client.slug);
        return (
          <li key={client.slug} className="client-logos__item">
            <div className="client-logos__plate">
              {logo ? (
                // The name is shown as text below, so the logo itself is decorative here.
                <img src={logo} alt="" className="client-logos__logo" loading="lazy" decoding="async" />
              ) : (
                <span className="client-logos__placeholder" aria-hidden="true">
                  Logo
                </span>
              )}
            </div>
            <p className="client-logos__name">{client.name}</p>
            <ul className="client-logos__services" role="list">
              {client.services.map((service) => (
                <li key={service}>{SERVICE_LABELS[service]}</li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
