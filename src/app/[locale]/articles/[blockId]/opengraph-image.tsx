import { ImageResponse } from 'next/og';
import { getProjectById } from '@/features/notion/services/project';

export const alt = 'Duong Phan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Text only: Notion thumbnail URLs are S3 presigned and expire in ~1 hour,
// but scrapers cache OG images much longer.
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string; blockId: string }> }) {
  const { blockId } = await params;
  const project = await getProjectById(blockId);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#fafafa',
        fontFamily: 'sans-serif',
        padding: 64,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700 }}>{project?.name ?? 'Duong Phan'}</div>
      {project && <div style={{ fontSize: 32, color: '#a3a3a3', marginTop: 16 }}>{project.technologies}</div>}
    </div>,
    { ...size },
  );
}
