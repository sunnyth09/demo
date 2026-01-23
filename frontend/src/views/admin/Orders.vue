<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Quản lý đơn hàng</h2>
        <p class="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Chờ xử lý</p>
        <p class="text-2xl font-bold mt-1">23</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Đang giao</p>
        <p class="text-2xl font-bold mt-1">45</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Hoàn thành</p>
        <p class="text-2xl font-bold mt-1">12</p>
      </div>
      <div class="bg-card rounded-lg border p-4">
        <p class="text-sm text-muted-foreground">Doanh thu</p>
        <p class="text-2xl font-bold mt-1">15.2M</p>
      </div>
    </div>

    <div class="bg-card rounded-xl border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="text-left p-4 font-medium text-sm">Mã đơn</th>
            <th class="text-left p-4 font-medium text-sm">Khách hàng</th>
            <th class="text-left p-4 font-medium text-sm">Tổng tiền</th>
            <th class="text-left p-4 font-medium text-sm">Trạng thái</th>
            <th class="text-left p-4 font-medium text-sm">Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t border-border">
            <td class="p-4 font-mono text-sm">#{{ order.id }}</td>
            <td class="p-4 text-sm">{{ order.customer }}</td>
            <td class="p-4 text-sm font-medium">{{ order.total }}</td>
            <td class="p-4"><span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{{ order.status }}</span></td>
            <td class="p-4 text-sm text-muted-foreground">{{ order.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const orders = [
  { id: '1234', customer: 'Nguyễn Văn A', total: '450,000đ', status: 'Hoàn thành', date: '22/01/2026' },
  { id: '1233', customer: 'Trần Thị B', total: '189,000đ', status: 'Đang giao', date: '22/01/2026' },
  { id: '1232', customer: 'Lê Văn C', total: '750,000đ', status: 'Chờ xử lý', date: '21/01/2026' },
]
</script>
