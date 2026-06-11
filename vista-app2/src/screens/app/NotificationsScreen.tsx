import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotificationStore, AppNotification, NotificationType } from '../../store/notificationStore';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

const TYPE_ICONS: Record<NotificationType, React.ComponentProps<typeof Ionicons>['name']> = {
  pm25: 'warning-outline',
  co2: 'cloud-outline',
  report: 'document-text-outline',
  filter: 'shield-outline',
  mode: 'moon-outline',
};

const TYPE_COLORS: Record<NotificationType, string> = {
  pm25: colors.red,
  co2: colors.amber,
  report: colors.green,
  filter: colors.coral,
  mode: colors.textSecondary,
};

function NotificationCard({ notification }: { notification: AppNotification }) {
  const iconColor = TYPE_COLORS[notification.type];
  const iconName = TYPE_ICONS[notification.type];

  return (
    <View style={cardStyles.card}>
      <View style={[cardStyles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <View style={cardStyles.content}>
        <View style={cardStyles.titleRow}>
          <Text style={cardStyles.title}>{notification.title}</Text>
          <Text style={cardStyles.time}>{notification.time}</Text>
        </View>
        <Text style={cardStyles.message}>{notification.message}</Text>
        {notification.link && (
          <TouchableOpacity>
            <Text style={cardStyles.link}>{notification.link}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  link: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
});

export function NotificationsScreen() {
  const navigation = useNavigation();
  const notifications = useNotificationStore((s) => s.notifications);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const today = notifications.filter((n) => n.date === 'Bugün');
  const yesterday = notifications.filter((n) => n.date === 'Dün');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Bildirimler</Text>
        <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Temizle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {today.length > 0 && (
          <>
            <Text style={styles.dateHeader}>Bugün</Text>
            {today.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </>
        )}

        {yesterday.length > 0 && (
          <>
            <Text style={styles.dateHeader}>Dün</Text>
            {yesterday.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </>
        )}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Bildirim yok</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  screenTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  clearText: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  dateHeader: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
