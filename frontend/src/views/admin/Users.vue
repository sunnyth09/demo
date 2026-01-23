<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý người dùng</h2>
        <p class="text-muted-foreground">Quản lý tài khoản người dùng</p>
      </div>
      <button class="h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium">
        + Thêm người dùng
      </button>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm">Người dùng</th>
            <th class="text-left p-4 font-medium text-sm">Email</th>
            <th class="text-left p-4 font-medium text-sm">Vai trò</th>
            <th class="text-left p-4 font-medium text-sm">Ngày tạo</th>
            <th class="text-left p-4 font-medium text-sm">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t border-border">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {{ user.name.charAt(0) }}
                </div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="p-4 text-sm">{{ user.email }}</td>
            <td class="p-4">
              <span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{{ user.role }}</span>
            </td>
            <td class="p-4 text-sm text-muted-foreground">{{ user.date }}</td>
            <td class="p-4">
              <button class="p-2 rounded-md hover:bg-accent">Sửa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', role: 'Admin', date: '01/01/2026' },
  { id: 2, name: 'Trần Thị B', email: 'b@email.com', role: 'User', date: '15/01/2026' },
  { id: 3, name: 'Lê Văn C', email: 'c@email.com', role: 'User', date: '20/01/2026' },
]
</script>
