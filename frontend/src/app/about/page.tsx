'use client';

import {useTranslations} from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t('title')} <span className="text-blue-600">ArkWork</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('intro')}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('vision.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t('vision.desc')}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('mission.title')}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>{t('mission.points.1')}</li>
              <li>{t('mission.points.2')}</li>
              <li>{t('mission.points.3')}</li>
              <li>{t('mission.points.4')}</li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('values.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { k: 'integrity' as const },
              { k: 'innovation' as const },
              { k: 'collaboration' as const },
              { k: 'quality' as const }
            ].map(({k}) => (
              <div key={k} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t(`values.items.${k}.title`)}</h3>
                <p className="text-gray-600">{t(`values.items.${k}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('closing.title')}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            {t('closing.desc')}
          </p>
          <a
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t('closing.cta')}
          </a>
        </div>
      </div>
    </div>
  );
}
