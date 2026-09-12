use tauri_plugin_sql::{Migration, MigrationKind};

fn migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "initial schema",
            sql: include_str!("../migrations/0001_initial.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "task due time + estimated duration",
            sql: include_str!("../migrations/0002_task_time.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "routine icon",
            sql: include_str!("../migrations/0003_routine_icon.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "task scheduled date",
            sql: include_str!("../migrations/0004_task_scheduled_date.sql"),
            kind: MigrationKind::Up,
        },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:taski.db", migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
