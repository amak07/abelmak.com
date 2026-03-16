import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Abel Mak — Full-Stack Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const manrope = await fetch(
    'https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-bg.ttf'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Terracotta accent bar */}
        <div
          style={{
            width: 8,
            height: '100%',
            backgroundColor: '#c2410c',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
        {/* Dot pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 400,
            height: '100%',
            backgroundImage:
              'radial-gradient(circle, #a8a29e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }}
        />
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontFamily: 'Manrope',
              fontWeight: 800,
              color: '#1c1917',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Abel Mak
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: 'Manrope',
              fontWeight: 600,
              color: '#c2410c',
              letterSpacing: '-0.01em',
              marginBottom: 32,
            }}
          >
            Full-Stack Software Engineer
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: 'Manrope',
              fontWeight: 400,
              color: '#57534e',
              lineHeight: 1.5,
              maxWidth: 600,
            }}
          >
            9+ years building React and .NET applications at enterprise scale
            for Visa, Cisco, and FM Global.
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: 'Manrope',
              fontWeight: 500,
              color: '#a8a29e',
              marginTop: 40,
            }}
          >
            abelmak.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Manrope',
          data: manrope,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Manrope',
          data: manrope,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Manrope',
          data: manrope,
          style: 'normal',
          weight: 800,
        },
      ],
    }
  );
}
