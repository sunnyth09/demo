<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold">Cài đặt</h2>
      <p class="text-muted-foreground">Cấu hình hệ thống</p>
    </div>

    <div class="grid gap-6">
      <div class="bg-card rounded-xl border p-6">
        <h3 class="font-semibold mb-4">Thông tin cửa hàng</h3>
        <div class="grid gap-4 max-w-xl">
          <div>
            <label class="block text-sm font-medium mb-2">Tên cửa hàng</label>
            <input type="text" value="Bookstore" class="w-full h-10 px-4 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input type="email" value="contact@bookstore.com" class="w-full h-10 px-4 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Số điện thoại</label>
            <input type="text" value="1900-1234" class="w-full h-10 px-4 rounded-md border border-input bg-background" />
          </div>
          <button class="w-fit h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium">
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div class="bg-card rounded-xl border p-6">
        <h3 class="font-semibold mb-4">Bảo mật</h3>
        <div class="grid gap-4 max-w-xl">
          <div>
            <label class="block text-sm font-medium mb-2">Mật khẩu hiện tại</label>
            <input type="password" placeholder="••••••••" class="w-full h-10 px-4 rounded-md border border-input bg-background" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mật khẩu mới</label>
            <input type="password" placeholder="••••••••" class="w-full h-10 px-4 rounded-md border border-input bg-background" />
          </div>
          <button class="w-fit h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
