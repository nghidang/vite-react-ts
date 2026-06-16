import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Đóng ranh giới module: code ngoài feature phải đi qua public API `features/<name>`
      // (index.ts), không được import sâu vào nội bộ. `pages/` được miễn để router còn
      // dùng `React.lazy(() => import('features/.../pages/...'))` giữ code-splitting.
      // Import nội bộ trong cùng feature dùng đường dẫn tương đối (không chứa "features/")
      // nên không bị luật này chạm tới.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Matcher của `no-restricted-imports` là package `ignore` (ngữ nghĩa .gitignore):
              // chỉ glob `*`/`**`, không negation/extglob, và pattern khớp một THƯ MỤC sẽ chặn
              // luôn nội dung bên dưới. Vì vậy KHÔNG dùng `**/features/*/*` (sẽ chặn cả `pages/`).
              // Cách bền nhất khả thi: liệt kê các thư mục nội bộ + các hậu tố file ở gốc feature.
              // `pages/` KHÔNG có trong danh sách → được phép (router cần cho code-splitting React.lazy).
              // Giới hạn: thêm thư mục/hậu tố nội bộ MỚI thì phải bổ sung vào đây (bản chất của
              // blacklist). Muốn kín tuyệt đối: dùng eslint-plugin-boundaries (element-type aware).
              group: [
                '**/features/*/stores/**',
                '**/features/*/services/**',
                '**/features/*/hooks/**',
                '**/features/*/components/**',
                '**/features/*/reducer/**',
                '**/features/*/*.slice',
                '**/features/*/*.store',
                '**/features/*/*.reducer',
                '**/features/*/*.service',
                '**/features/*/*.schemas',
                '**/features/*/*.errors',
                '**/features/*/*.types',
                '**/features/*/*.constants',
              ],
              message:
                'Import qua public API của feature: `import { ... } from "…/features/<name>"` (index.ts), không import sâu vào nội bộ feature.',
            },
          ],
        },
      ],
    },
  },
  {
    // File định nghĩa route là cấu hình (export mảng RouteObject) chứ không phải module
    // component — fast-refresh không áp dụng, nên tắt rule cho khỏi báo nhầm các `lazy()` cục bộ.
    files: ['**/*.routes.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
