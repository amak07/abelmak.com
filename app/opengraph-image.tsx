import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'Abel Mak — Full-Stack Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const manrope = readFileSync(join(process.cwd(), 'app', 'fonts', 'Manrope-ExtraBold.ttf'));
  const profilePic = readFileSync(join(process.cwd(), 'public', 'profile_pic.png'));

  const profileSrc = `data:image/png;base64,${profilePic.toString('base64')}`;

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
        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '60px 80px',
            flex: 1,
          }}
        >
          {/* Text side */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              paddingRight: 60,
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
                maxWidth: 500,
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
          {/* Profile photo */}
          <img
            src={profileSrc}
            width={280}
            height={280}
            style={{
              borderRadius: '50%',
              border: '4px solid #e7e5e4',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Manrope',
          data: manrope,
          style: 'normal' as const,
          weight: 800 as const,
        },
      ],
    }
  );
}
