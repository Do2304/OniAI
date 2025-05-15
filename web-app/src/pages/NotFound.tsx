import { useTheme } from '@/components/theme-provider';

function NotFound() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      Không tìm thấy trang này !!!{' '}
      <div>
        <h1>Chế độ hiện tại: {theme}</h1>
        <button onClick={() => setTheme('light')}>Chế độ sáng</button>
        <button onClick={() => setTheme('dark')}>Chế độ tối</button>
        <button onClick={() => setTheme('system')}>Chế độ theo hệ thống</button>
      </div>
    </>
  );
}

export default NotFound;
