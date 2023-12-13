import { Module } from '@nestjs/common';
import { Routes, RouterModule } from 'nest-router';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';

import { join } from 'path';
import AuthModule from './auth/auth.module';
import UsersModule from './users/users.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/users', module: UsersModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    AuthModule,
    UsersModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'zh-CN': 'zh',
        'uk-UA': 'uk',
      },
      loaderOptions: {
        path: join(__dirname, '../../common/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [],
})
export default class V1Module { }
